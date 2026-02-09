# Page Info

## 导航结构
- Root Stack
  - `(tabs)`
- Tabs
  - `Map` (`app/(tabs)/map.tsx`)
  - `Friends` (`app/(tabs)/friends.tsx`)
  - `Me` (`app/(tabs)/me.tsx`)
- `index` (`app/(tabs)/index.tsx`) 仅做重定向到 `map`，不展示在 TabBar。

## 页面定义

## 1) Map Page
- 文件：`app/(tabs)/map.tsx`
- 核心职责：
  - 展示地图底图
  - 申请定位权限
  - 展示用户当前位置
  - 提供“重新定位”入口
- 后续子模块（计划）：
  - Friend Markers Layer
  - Location Sampling Controller
  - Realtime Stream Listener
  - Bottom Sheet（好友详情）
- 状态栏/UI：
  - 顶部轻量状态提示（定位中/权限拒绝）
  - 右下角定位按钮（浮动）

## 2) Friends Page
- 文件：`app/(tabs)/friends.tsx`
- 核心职责（计划）：
  - 好友列表
  - 邀请入口
  - 好友状态（在线/最近活跃）
- 可能子页面：
  - Friend Detail
  - Invite / Search

## 3) Me Page
- 文件：`app/(tabs)/me.tsx`
- 核心职责（计划）：
  - 账号信息
  - 隐私设置（共享开关、精确/模糊）
  - 调试区（最近定位样本、同步队列）
- 可能子页面：
  - Privacy Settings
  - Debug Console

## 全局状态建议
- App 前台/后台状态
- 定位权限状态
- 采样档位（low/medium/high）
- 同步队列状态（pending/sending/failed）
