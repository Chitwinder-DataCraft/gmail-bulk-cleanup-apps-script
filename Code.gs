function deleteAllGmailMessages() {

  const BATCH_SIZE = 500;
  const MAX_RUNTIME = 5 * 60 * 1000; // 5 minutes
  const startTime = Date.now();

  let totalDeleted = 0;

  while (Date.now() - startTime < MAX_RUNTIME) {

    const response = GmailAPI.Users.Messages.list('me', {
      maxResults: BATCH_SIZE,
      includeSpamTrash: true
    });

    const messages = response.messages || [];

    if (messages.length === 0) {
      Logger.log("================================");
      Logger.log("GMAIL IS COMPLETELY EMPTY!");
      Logger.log("================================");

      removeCleanupTriggers();
      return;
    }

    const ids = messages.map(function(message) {
      return message.id;
    });

    try {

      GmailAPI.Users.Messages.batchDelete({
        ids: ids
      }, 'me');

      totalDeleted += ids.length;

      Logger.log(
        "Deleted this batch: " +
        ids.length +
        " | Total this run: " +
        totalDeleted
      );

    } catch (error) {

      Logger.log("Batch delete failed: " + error.message);

      // Try smaller batches if Gmail rejects the large batch
      for (let i = 0; i < ids.length; i += 100) {

        const smallerBatch = ids.slice(i, i + 100);

        try {

          GmailAPI.Users.Messages.batchDelete({
            ids: smallerBatch
          }, 'me');

          totalDeleted += smallerBatch.length;

        } catch (smallError) {

          Logger.log(
            "Small batch failed: " +
            smallError.message
          );

        }
      }
    }
  }

  Logger.log(
    "Execution finished. Deleted " +
    totalDeleted +
    " messages."
  );

  createOneCleanupTrigger();
}


function createOneCleanupTrigger() {

  // Remove existing cleanup triggers first
  removeCleanupTriggers();

  // Create ONLY ONE trigger
  ScriptApp.newTrigger('deleteAllGmailMessages')
    .timeBased()
    .after(60 * 1000)
    .create();

  Logger.log("Next cleanup run scheduled in about 1 minute.");
}


function removeCleanupTriggers() {

  const triggers = ScriptApp.getProjectTriggers();

  triggers.forEach(function(trigger) {

    if (
      trigger.getHandlerFunction() ===
      'deleteAllGmailMessages'
    ) {

      ScriptApp.deleteTrigger(trigger);

    }

  });

}
