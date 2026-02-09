# 类 Zenly App 开发说明

## 当前目标（本阶段）
- 移除 Expo 默认模板界面。
- 仅保留底部 Tab 导航。
- 建立占位页面，作为后续迭代基础。

## 本次已完成
- 将根布局改为最小化 `Stack`：只挂载 `(tabs)`。
- 将默认 Tabs 改为 3 个核心入口：
  - `Map`
  - `Friends`
  - `Me`
- 用占位内容替换默认示例页面。
- 移除模板中的 modal 示例路由。

## 下一步（评审后执行）
1. 明确产品骨架
- 确认导航信息架构（最终 Tab 数量、命名、Profile 是否独立）。
- 在功能开发前确定状态管理主方案（Redux / Zustand / React Query）。

2. 基础工程层
- 建立严格的 TypeScript DTO：`user`、`location`、`friendship`、`ghostMode`。
- 建立 API 访问层骨架（建议 `services/api/*`）和环境变量管理。
- 加全局错误边界与请求重试策略。

3. 地图核心（MVP-1）
- 接入地图 SDK（`react-native-maps` 或 Mapbox）。
- 完成定位权限流程与当前位置标识。
- 先用 mock 数据渲染好友点位。

4. 实时位置（MVP-2）
- 设计前台/后台定位更新策略。
- 建立 socket 通道，接收好友实时位置流。
- 加同步节流策略，兼顾电量与实时性。

5. 社交关系基础（MVP-3）
- Friends 页先做列表与邀请入口（可先 mock 再接真 API）。
- 地图点位点击弹出好友信息 Bottom Sheet。
- 增加隐私控制：共享开关、精确/模糊位置。

6. Zenly 风格交互（MVP-4）
- 好友点位快捷互动（emoji/reaction）。
- 可选轨迹/行动线预览。
- 补充以地图为中心的轻量动效与页面切换。

7. 稳定性阶段
- 最近位置离线缓存策略。
- 崩溃监控与行为埋点。
- 权限拒绝、弱网、后台唤醒等边界处理。

8. 发布准备
- 构建环境划分（dev / preview / prod）。
- EAS Build 与 OTA 更新策略。
- iOS/Android 行为一致性 QA 清单。

## 建议的后续编码顺序
1. 地图 SDK + 定位权限
2. 地图上的好友点位（mock）
3. 实时通道骨架（socket）
4. Friends 页（列表 + 详情入口）
5. Me 页（隐私与账号设置）
