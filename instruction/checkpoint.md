# Checkpoint

## 项目阶段
- [x] Stage 0: Expo 模板清理（保留最小导航骨架）
- [x] Stage 1: Tab 导航建立（Map/Friends/Me）
- [x] Stage 2: Map MVP（地图展示 + 定位权限 + 当前定位点）
- [ ] Stage 3: SQLite 本地存储落地
- [ ] Stage 4: Mock 数据回放与 Provider 切换
- [ ] Stage 5: 后台定位任务 + 动态采样策略
- [ ] Stage 6: 同步队列 + 服务端上报骨架

## 当前进行中
- Focus: 文档体系重构为 `instruction/` 目录
- 状态: 完成

## 下一步（建议）
1. 建立 SQLite 基础层（建表/写入/查询）
2. 在 Map 页落地 location sample 入库
3. 在 Me 页加 Debug 面板（查看最近 N 条样本）
4. 接入 Mock 轨迹回放，支持 mock/real 切换

## 变更记录
### 2026-02-09
- 创建 `instruction/` 文档中心
- 删除旧根目录 `instructions.md`
- 初始化 SQLite 设计、Page 信息、Checkpoint 文档
