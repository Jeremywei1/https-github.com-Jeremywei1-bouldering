export interface SlideData {
  id: string;
  grade: string;
  title: string;
  subtitle?: string;
}

export const slides: SlideData[] = [
  {
    id: "intro",
    grade: "总览",
    title: "智能归因 Agent 核心架构与实践",
    subtitle: "从零到一构建高可用业务 Agent 的思考与挑战",
  },
  {
    id: "v0",
    grade: "V0",
    title: "环境与基建：打桩",
    subtitle: "搭建运行沙盒，接入基础大模型 API，连通基本的数据管道。",
  },
  {
    id: "v1",
    grade: "V1",
    title: "Prompt Engineering：寻找手感",
    subtitle: "理解 Few-Shot 与 Chain-of-Thought 在归因场景的实际威力与局限。",
  },
  {
    id: "v2",
    grade: "V2",
    title: "Function Calling：接入工具箱",
    subtitle: "从单纯的 LLM 对话向 API 调度引擎转型，让模型获取数据库查询能力。",
  },
  {
    id: "v3",
    grade: "V3",
    title: "上下文与状态管理：防止掉落",
    subtitle: "多轮交互中的记忆留存与 Token 窗口管理机制。",
  },
  {
    id: "v4",
    grade: "V4",
    title: "多步推理与回溯：规划路线",
    subtitle: "ReAct 模式的应用，让 Agent 学会自我评估与重新执行查询。",
  },
  {
    id: "v5",
    grade: "V5",
    title: "海量数据处理：耐力战",
    subtitle: "面对大量归因埋点数据时的 Chunking、Map-Reduce 策略优化。",
  },
  {
    id: "v6",
    grade: "V6",
    title: "延迟优化与并发：动态发力",
    subtitle: "流式输出、并发工具调用与缓存机制的设计与权衡。",
  },
  {
    id: "v7",
    grade: "V7",
    title: "权限边界与安全：顶绳保护",
    subtitle: "严格管理 Agent 能够执行的 SQL 与 API，防范数据越权访问与 Prompt 注入。",
  },
  {
    id: "v8",
    grade: "V8",
    title: "多智能体协同：团队协作",
    subtitle: "拆分意图理解、数据查询、以及结果总结模块，实现专家路由配合。",
  },
  {
    id: "v9",
    grade: "V9",
    title: "效果评估与自适应：创造新路线",
    subtitle: "构建黄金评测集，引入 RAG + 动态示例检索提升冷门归因案例的准确率。",
  },
  {
    id: "v10",
    grade: "V10",
    title: "终极形态与业务落地：攀岩大师",
    subtitle: "完美融入现有 BI 系统的高效、稳定智能归因引擎。",
  },
];
