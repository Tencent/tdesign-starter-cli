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
			validate: (input: any) => {
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
		// {
		// 	type: 'list',
		// 	name: 'type',
		// 	message: '选择模板类型：',
		// 	choices: [
		// 		{ name: '【PC端】模板', value: 'pc' },
		// 		{ name: '【移动端】模板', value: 'h5' }
		// 	],
		// 	default: 'pc' // 默认值为列表项编号，起始为 0
		// }
	];
	return inquirer.prompt(questions);
}
