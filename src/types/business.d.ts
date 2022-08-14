/** 用户相关模块 */
declare namespace Auth {
  /**
   * 用户角色类型(前端静态路由用角色类型进行路由权限的控制)
   * - super: 超级管理员(该权限具有所有路由数据)
   * - admin: 管理员
   * - user: 用户
   * - custom: 自定义角色
   */
  // type RoleType = keyof typeof import('@/enum').EnumUserRole;

  /** 用户信息 */
  interface UserInfo {
    /** 用户id */
    userId: string;
    /** 用户名 */
    userName: string;
    /* 用户称呼 */
    realName: string;
    /* 用户头像 */
    avatar: string;
    /** 用户角色类型 */
    role: RoleType;
    /* 密码 */
    password: string;
    /* token */
    token: string;
    /* 权限路由 */
    permissions: UserInfoPermissions[];
  }
  interface UserInfoPermissions {
    name: string;
    path: string;
    meta: AppRoute.RouteMeta;
    children?: UserInfoPermissions[];
  }
}