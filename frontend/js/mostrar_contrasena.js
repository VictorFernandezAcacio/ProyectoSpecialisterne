// Script único para todos los ojitos
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".toggle-eye");
  if (!btn) return;

  const targetId = btn.dataset.target;
  const input = document.getElementById(targetId);
  if (!input) return;

  input.type = input.type === "password" ? "text" : "password";
});
