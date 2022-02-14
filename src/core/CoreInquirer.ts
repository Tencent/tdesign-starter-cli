import inquirer from 'inquirer';

/**
 * 交互命令
 * @returns 命令行数组
 */
export function interactionsHandler() {
	// 提问模式
	const questions = [
		{
			type: 'input',
			name: 'name',
			message: '请输入项目名称：',
			validate: (input: string) => {
				if (!input) {
					return '请输入项目名称!';
				}
				return true;
			}
		},
		{
			type: 'input',
			name: 'description',
			message: '请输入项目描述：',
			default: 'Base on tdesign-starter-cli'
		},
		{
			type: 'list',
			name: 'type',
			message: '选择模板类型：',
			choices: [
				{ name: '【Vue2】模板', value: 'vue2' },
				{ name: '【Vue3】模板', value: 'vue3' }
			],
			default: 'vue2' // 默认值为列表项编号，起始为 0
		},
		
	];
	return inquirer.prompt(questions);
}
