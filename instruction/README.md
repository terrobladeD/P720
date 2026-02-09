# Project Instruction Center

这个目录用于维护项目进度与协作上下文。后续你可以优先看这里，不必先看实现细节。

## 文件说明
- `instruction/checkpoint.md`：里程碑、当前进度、下一步。
- `instruction/page-info.md`：页面功能定义、子页面、状态栏与入口说明。
- `instruction/sqlite-design.md`：本地 SQLite 表结构设计与字段约束。

## 维护规则
1. 每次完成一个阶段后更新 `checkpoint.md`。
2. 页面职责变化时同步更新 `page-info.md`。
3. 本地数据结构变化时同步更新 `sqlite-design.md`。
4. 如果实现与文档冲突，以文档为准先评审，再改代码。
