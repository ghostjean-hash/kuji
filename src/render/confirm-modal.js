import { showModal } from "./modal.js";

export function showConfirmModal({ title, message, onConfirm, onCancel }) {
  showModal({
    title,
    body: `<p>${message}</p>`,
    confirmLabel: "확인",
    showCancel: true,
    cancelLabel: "취소",
    onConfirm,
    onClose: onCancel,
  });
}
