export interface SlideData {
  id: string;
  grade: string;
  title: string;
  subtitle?: string;
  content?: string;
  section?: string;
  chapter?: string;
}

export const slides: SlideData[] = [
  {
    id: "v0",
    grade: "示例",
    title: "最小skill长什么样",
    section: "1.1",
    chapter: "简易Skill案例",
    content: `
- 一个最小skill只需要一个 \`SKILL.md\` 文件
- 注：SKILL.md的最佳大小是≤500行 ([Anthropic](https://code.claude.com/docs/en/skills)) 或者 ≤5,000tokens ([AIME](https://bytedance.larkoffice.com/wiki/BvBrwEm60iJ5fOkQQOYc4FvOnJd))

\`\`\`markdown
---
name: summarize-sheet
description: 总结一个表格或CSV的主要发现，适合在用户提供文件、sheet链接或表格截图后调用
---

当用户要求“总结表格 / 看看这个sheet / 提炼数据结论”时：
1. 先确认输入来源<font color="gray">（本地文件、Lark Sheet、截图）</font>
2. 如果是结构化表格，先概览字段、行数、缺失情况
3. 输出：
   - 关键发现
   - 异常点
   - 建议下一步分析
\`\`\`
`
  },
  {
    id: "v1",
    grade: "解析",
    title: "这个skill为什么算 “最小可运行”",
    section: "1.2",
    chapter: "简易Skill案例",
    content: `
因为它已经具备了一个 skill 的最关键元素，只要这三部分清楚，这个 skill 就已经可以工作：
- **name**：skill 名称
- **description**：说明什么时候调用，解决了什么问题
- **instructions**：被调用后应该怎么做
`
  },
  {
    id: "v2",
    grade: "原则",
    title: "初期写最小 skill 的原则",
    section: "1.3",
    chapter: "简易Skill案例",
    content: `
优先把这三点表达清楚：
- **触发场景**：用户什么时候会需要它？
- **执行步骤**：skill 被调起后需要做什么？
- **输出结果**：最后要给用户什么内容 or 产出？
`
  },
  {
    id: "v3",
    grade: "进阶",
    title: "推荐目录结构",
    subtitle: "当问题变复杂时，不要把所有内容都塞进 SKILL.md，更好的方式是把主流程和细节资料分开。",
    section: "2.1",
    chapter: "复杂Skill结构",
    content: `
\`\`\`markdown
weekly-report-skill/
  ├── SKILL.md
  ├── checklists/
  │   ├── summary-checklist.md
  │   └── data-quality-checklist.md
  ├── examples/
  │   ├── good-output-example.md
  │   └── bad-output-example.md
  ├── templates/
  │   ├── report-template.md
  │   └── followup-questions.md
  └── references/
      ├── metric-definitions.md
      └── common_analysis-patterns.md
\`\`\`
`
  },
  {
    id: "v4",
    grade: "规范",
    title: "每个文件夹建议放什么",
    section: "2.2",
    chapter: "复杂Skill结构",
    content: `
<table col-widths="134,306">
    <tr>
        <td>SKILL.md</td>
        <td>最重要的内容：<br>- 触发条件<br>- skill 目标<br>- 执行主流程<br>- 输出要求<br>- 边界条件</td>
    </tr>
    <tr>
        <td>checklists/</td>
        <td>稳定流程：<br>- 分析的checklist<br>- 质检的checklist<br>- 输出前检查项</td>
    </tr>
    <tr>
        <td>examples/</td>
        <td>放示例：<br>- 好的输出示例<br>- 坏的输出示例<br>- 常见输入示例</td>
    </tr>
    <tr>
        <td>templates/</td>
        <td>放模板：<br>- 固定的输出结构<br>- 汇报模板是什么样的（如有）<br>- 追问模板是什么样的（如有）</td>
    </tr>
    <tr>
        <td>references/</td>
        <td>放参考资料：<br>- 指标的定义<br>- 业务背景<br>- 常见的分析套路等等</td>
    </tr>
</table>
`
  },
  {
    id: "v5",
    grade: "设计",
    title: "优劣 description 对比",
    subtitle: "description是skill设计里最影响效果的部分之一，直接决定了系统是否容易在正确场景下调用这个skill。",
    section: "3.",
    chapter: "Description对比",
    content: `
#### 3.1 不好的description
\`description: 帮助用户做分析\`；这个写法存在问题如下：
- 太泛了
- 没说分析什么
- 没说什么场景调用
- 没说输入是什么
- 结果就是非常容易和别的 skill 冲突

#### 3.2 好的 description 示例
\`description: 当用户希望总结表格、CSV、Lark Sheet 或查询结果中的主要发现时调用，适用于结构化数据总结、异常识别和业务结论提炼，不适用于复杂SQL生成或代码调试\`；

这个写法更好，因为它同时说明了：
- 何时调用
- 适合在什么输入
- 完成了什么任务
- 不适合什么样的任务
`
  },
  {
    id: "v6",
    grade: "公式",
    title: "description 写法公式",
    section: "3.3",
    chapter: "Description对比",
    content: `
- 建议用这个公式：\`当用户...时调用，适用于...，完成...，不适用于...\`

- 例如：\`description: 当用户要求总结实验结果、提炼指标变化原因、生成简要业务结论时调用，适用于结构化结果分析和汇报，不适用于原始数据拉取或统计建模\`
`
  },
  {
    id: "v7",
    grade: "判断",
    title: "什么样的场景适合做skill",
    section: "4.",
    chapter: "适用场景",
    content: `
一个需求满足以下 3 条中的 2 条，就适合做 skill：
- 会重复发生
- 触发条件相对稳定
- 输出结构/执行流程相对固定

<table col-widths="216,170,170">
    <tr>
        <td>场景</td>
        <td>适不适合做成skill</td>
        <td>原因</td>
    </tr>
    <tr>
        <td>经常重复的任务</td>
        <td>适合</td>
        <td>有稳定触发词和流程</td>
    </tr>
    <tr>
        <td>一个团队都在做的SOP</td>
        <td>适合</td>
        <td>有需求，可复用</td>
    </tr>
    <tr>
        <td>一次性临时任务</td>
        <td>不适合</td>
        <td>prompt对话更快</td>
    </tr>
    <tr>
        <td>强依赖上下文探索的复杂任务</td>
        <td>适合</td>
        <td>Skill + reference files</td>
    </tr>
</table>
`
  },
  {
    id: "v8",
    grade: "实战",
    title: "抽象 skill 的目标",
    section: "5.1",
    chapter: "实战篇",
    content: `
确定希望解决的这个重复性问题是什么，与AI沟通脑爆。非常建议打开plan模式，不需要/plan显式调用，只需要告诉AI你的诉求是什么，希望做一个什么skill，然后帮你make plan即可。

可以思考&与AI讨论的话题：
- **结构**：这个skill中间需要哪些能力？
- **稳定性**：哪些能力是可以复用的？
- **渐进式加载**：skill最佳运行步骤是怎么样的？触发场景是什么样的？

\`\`\`markdown
---
name: 会议纪要总结
description: 用于将会议记录、飞书妙记或会议逐字稿整理成结构化会议纪要。适用于用户要求“总结会议”“整理纪要”“提炼 action items”等场景。
---
  
# 会议纪要总结
请将用户提供的会议内容整理成结构化会议纪要。

## 输出结构
### 一句话总结
用一句话概括这次会议的核心结论。
... (省略部分内容) ...

## 规则
- 不编造会议中没有提到的信息。
- 保留关键数字、时间点、负责人和决策。
- 合并重复内容。
- 用中文输出。
\`\`\`

复杂skill需要有一个专属文件夹，将详细参考资料从skill.md移动到其余辅助文件中，建议满足以下要求：
- 对复杂流程提供 checklist
- 对 supporting files 做清晰职责划分

\`\`\`markdown
**skill**/
├─ SKILL.md                  ← Skill 入口：触发条件 + 执行入口
├─ other supporting files    ← 如：数据获取/校验流程、skill产出校验测试等
└─ other reference materials ← 如：输出文档格式案例等
\`\`\`
`
  },
  {
    id: "v9",
    grade: "触发",
    title: "确定触发场景与设计 description",
    section: "5.2 & 5.3",
    chapter: "实战篇",
    content: `
#### 5.2 确定触发场景
确定用户何时会触发，会如何触发skill，比如周报总结的skill触发场景可能是：
- 帮我写这周的数据总结
- 把这个表整理成周报结论
- 看看这份周度指标结果，输出业务摘要
- 把这个 sheet 提炼成汇报内容

#### 5.3 设计 description
以周报异动归因skill为例：
- description: 当用户希望把周度指标结果、表格、CSV 或 Lark Sheet 整理成业务周报摘要时调用，适用于结构化数据总结、异常识别、原因提炼和行动建议输出，不适用于复杂SQL生成或代码调试
`
  },
  {
    id: "v10",
    grade: "设计",
    title: "设计主流程",
    section: "5.4",
    chapter: "实战篇",
    content: `
还是以一个周报异动归因skill为例：

skill 被调用后，应该稳定地先执行这几步：
1. 识别数据范围、时间范围和核心指标
2. 先总结整体趋势
3. 找出最明显的增长、下降和异常波动的环节
4. 若有分维度数据，识别主要贡献来源
5. 输出业务可读的总结和todo，而不是只重复数字
`
  },
  {
    id: "v11",
    grade: "排查",
    title: "一个调试 checklist",
    section: "6.",
    chapter: "调试排错",
    content: `
#### 6.1 skill 没被触发时
逐一检查下面几项：
- [ ] description 是否太过宽泛
- [ ] 是否写清了用户会如何表达需求
- [ ] 是否写清了输入内容的类型
- [ ] 是否有和别的 skill 有严重重叠
- [ ] name 是否过于抽象不易理解
- [ ] 是否把关键场景词写进了 description

#### 6.2 skill 被触发了，但执行错了时
逐一检查下面几项：
- [ ] 主流程是否写得太过模糊
- [ ] 是否缺少了边界条件或者边际case
- [ ] 是否没有写“不要用于什么场景”
- [ ] 输出格式是不是表达的不够清楚
- [ ] 是否把过多细节堆在一个文件里，导致AI对主线不清晰

#### 6.3 skill 输出质量不稳定时
逐一检查下面几项：
- [ ] 是否缺少 checklist
- [ ] 是否缺少正反案例
- [ ] 是否缺少了固定输出模板
- [ ] 是否把多个目标混在同一个 skill 里
- [ ] 是否需要拆成几个更专一的 skill
`
  }
];
