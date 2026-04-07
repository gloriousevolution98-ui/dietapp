const AUTH_ENABLED_VALUES = new Set(["1", "true", "yes", "on"]);

export const AUTH_DISABLED_MESSAGE =
  "로그인이 꺼져 있습니다. 인증을 다시 켜거나 저장 기능을 잠시 보류하세요.";

export function isAuthEnabled() {
  const rawValue = process.env.NEXT_PUBLIC_ENABLE_AUTH?.trim().toLowerCase();
  return rawValue ? AUTH_ENABLED_VALUES.has(rawValue) : false;
}
