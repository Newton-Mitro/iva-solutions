type WorkflowLogMessage = {
  type: "IVAC_WORKFLOW_LOG";
  message: string;
  level: "success" | "info" | "warning" | "error";
  time: string;
};

chrome.runtime.onMessage.addListener((message: WorkflowLogMessage) => {
  if (message?.type !== "IVAC_WORKFLOW_LOG") {
    return;
  }

  const prefix = `[IVAC automation] ${message.time}`;

  if (message.level === "error") {
    console.error(prefix, message.message);
  } else if (message.level === "warning") {
    console.warn(prefix, message.message);
  } else {
    console.log(prefix, message.message);
  }
});

console.log("[IVAC automation] Content logger ready");
