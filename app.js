const state = {
  area: "",
  confidence: ""
};

const profiles = {
  form: {
    title: "流程防錯大師",
    expert: "你很適合幫忙看表單流程中的錯填、漏填、前後不一致，以及哪些地方一定要人工覆核。",
    direction: "你可以幫忙提醒表單流程中容易被工程端低估的實務細節。",
    curious: "你可以先從表單流程旁聽，幫忙指出哪些問題看起來不像現場會發生。",
    reply: "我比較熟表單審查，可以幫你看哪裡可能想錯。"
  },
  admin: {
    title: "行政文書守門員",
    expert: "你很適合幫忙確認公文、裁處、訴願或審查流程裡，哪些文字不能讓工具自動下結論。",
    direction: "你可以幫忙提醒行政文書輔助工具的語氣邊界與人工覆核點。",
    curious: "你可以先從行政文書方向旁聽，看看哪些地方需要更嚴謹的實務校正。",
    reply: "我比較熟行政文書，可以幫你看人工覆核和語氣邊界。"
  },
  stats: {
    title: "統計口徑校正官",
    expert: "你很適合幫忙確認不同單位的年齡、地區、年度、類別定義不一致時，怎麼呈現才不會誤導。",
    direction: "你可以幫忙看統計指標是否容易被過度解讀，或是否需要加註限制。",
    curious: "你可以先從統計口徑方向旁聽，幫忙看哪些說法不夠精準。",
    reply: "我比較熟統計口徑，可以幫你看資料定義怎麼避免誤導。"
  },
  audit: {
    title: "現場風險雷達",
    expert: "你很適合幫忙判斷什麼樣的異常值得提示，以及什麼樣的提示語氣不會造成誤會。",
    direction: "你可以幫忙看稽查或管理流程中，哪些訊號適合被系統提醒。",
    curious: "你可以先從稽查流程方向旁聽，看看異常提示是否貼近現場。",
    reply: "我比較熟稽查或管理流程，可以幫你看異常提示是否貼近現場。"
  },
  ux: {
    title: "第一線體驗官",
    expert: "你很適合幫忙判斷第一線畫面第一眼該看到什麼，以及哪些資訊不該放在第一層。",
    direction: "你可以幫忙看儀表板或報表流程是否符合日常工作節奏。",
    curious: "你可以先從使用者流程方向旁聽，幫忙指出哪裡看起來不直覺。",
    reply: "我比較熟第一線使用流程，可以幫你看畫面和資訊順序。"
  },
  pitch: {
    title: "故事收斂手",
    expert: "你很適合幫忙把實務痛點、技術雛形和 Demo 收斂成評審能快速理解的故事。",
    direction: "你可以幫忙看提案主軸是否太散，或哪些內容應該先講。",
    curious: "你可以先從提案方向旁聽，幫忙指出哪裡不夠好懂。",
    reply: "我比較熟提案整理，可以幫你看怎麼把故事講清楚。"
  }
};

const steps = Array.from(document.querySelectorAll(".quiz-step"));
const dots = Array.from(document.querySelectorAll("[data-step-dot]"));
const areaButtons = Array.from(document.querySelectorAll("[data-area]"));
const confidenceButtons = Array.from(document.querySelectorAll("[data-confidence]"));
const resultTitle = document.getElementById("result-title");
const resultCopy = document.getElementById("result-copy");
const replyText = document.getElementById("reply-text");
const copyButton = document.getElementById("copy-reply");
const restartButton = document.getElementById("restart-quiz");
const contactForm = document.getElementById("contact-form");
const submitButton = document.getElementById("submit-contact");
const submitStatus = document.getElementById("submit-status");

function showStep(stepNumber) {
  steps.forEach((step) => {
    step.classList.toggle("active", step.dataset.step === String(stepNumber));
  });
  dots.forEach((dot) => {
    dot.classList.toggle("active", Number(dot.dataset.stepDot) <= stepNumber);
  });
}

function renderResult() {
  const profile = profiles[state.area] || profiles.form;
  const confidence = state.confidence || "direction";
  resultTitle.textContent = profile.title;
  resultCopy.textContent = profile[confidence];
  replyText.textContent = profile.reply;
}

function getAreaLabel(area) {
  const selected = document.querySelector(`[data-area="${area}"] strong`);
  return selected ? selected.textContent : "";
}

function getConfidenceLabel(confidence) {
  const selected = document.querySelector(`[data-confidence="${confidence}"] strong`);
  return selected ? selected.textContent : "";
}

areaButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.area = button.dataset.area;
    areaButtons.forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
    showStep(2);
  });
});

confidenceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.confidence = button.dataset.confidence;
    confidenceButtons.forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
    renderResult();
    showStep(3);
  });
});

copyButton.addEventListener("click", async () => {
  const text = replyText.textContent || "";
  try {
    await navigator.clipboard.writeText(text);
    copyButton.textContent = "已複製";
    setTimeout(() => {
      copyButton.textContent = "複製回覆句";
    }, 1400);
  } catch (error) {
    copyButton.textContent = "請手動複製";
  }
});

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const config = window.SOONG_FORM_CONFIG || {};
  const endpoint = String(config.googleScriptEndpoint || "").trim();
  if (!endpoint) {
    submitStatus.textContent = "尚未設定後端寫入端點，請先部署 Apps Script Web App。";
    return;
  }

  const formData = new FormData(contactForm);
  const payload = {
    source: config.source || "public_site",
    display_name: formData.get("display_name") || "",
    contact: formData.get("contact") || "",
    message: formData.get("message") || "",
    website: formData.get("website") || "",
    selected_area: state.area,
    selected_area_label: getAreaLabel(state.area),
    confidence: state.confidence,
    confidence_label: getConfidenceLabel(state.confidence),
    result_title: resultTitle.textContent || "",
    reply_text: replyText.textContent || "",
    user_agent: navigator.userAgent || ""
  };

  submitButton.disabled = true;
  submitButton.textContent = "送出中";
  submitStatus.textContent = "";

  try {
    await fetch(endpoint, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });

    submitStatus.textContent = "已送出。若你有公開留言或社群帳號，也可以直接貼給我。";
    contactForm.reset();
    if (config.afterSubmitUrl) {
      window.setTimeout(() => {
        window.location.href = config.afterSubmitUrl;
      }, 900);
    }
  } catch (error) {
    submitStatus.textContent = "送出失敗，請改用複製回覆句或稍後再試。";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "送出聯絡資料";
  }
});

restartButton.addEventListener("click", () => {
  state.area = "";
  state.confidence = "";
  areaButtons.forEach((item) => item.classList.remove("selected"));
  confidenceButtons.forEach((item) => item.classList.remove("selected"));
  contactForm.reset();
  submitStatus.textContent = "";
  showStep(1);
});
