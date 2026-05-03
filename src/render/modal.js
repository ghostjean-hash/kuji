// 모달 / 시트 공통 (03_architecture 3.12).

export function showModal({
  title,
  body,
  onClose,
  onConfirm,
  confirmLabel = "확인",
  showCancel = false,
  cancelLabel = "취소",
}) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  const modal = document.createElement("div");
  modal.className = "modal";
  if (title) {
    const h = document.createElement("h2");
    h.className = "modal-title";
    h.textContent = title;
    modal.appendChild(h);
  }
  const bodyEl = document.createElement("div");
  bodyEl.className = "modal-body";
  if (typeof body === "string") {
    bodyEl.innerHTML = body;
  } else if (body instanceof HTMLElement) {
    bodyEl.appendChild(body);
  }
  modal.appendChild(bodyEl);

  const actions = document.createElement("div");
  actions.className = "modal-actions";
  if (showCancel) {
    const cancel = document.createElement("button");
    cancel.className = "modal-cancel";
    cancel.textContent = cancelLabel;
    cancel.addEventListener("click", close);
    actions.appendChild(cancel);
  }
  const confirm = document.createElement("button");
  confirm.className = "modal-confirm";
  confirm.textContent = confirmLabel;
  confirm.addEventListener("click", () => {
    close();
    if (onConfirm) onConfirm();
  });
  actions.appendChild(confirm);
  modal.appendChild(actions);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  function close() {
    overlay.remove();
    if (onClose) onClose();
  }

  return { close };
}
