/**
 * 邮箱格式校验
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * URL 格式校验
 */
export const isValidUrl = (url: string): boolean => {
  try {
    // eslint-disable-next-line no-new
    new URL(url);
    return true;
  }
  catch {
    return false;
  }
};

/**
 * 用户名格式校验（不能包含特殊字符）
 */
export const isValidUsername = (name: string): boolean => {
  // Git 用户名允许字母、数字、空格、点、下划线、连字符
  const nameRegex = /^[a-zA-Z0-9\s._-]+$/;
  return nameRegex.test(name) && name.trim().length > 0;
};
