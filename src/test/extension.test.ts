import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Extension should be present', () => {
		assert.ok(vscode.extensions.getExtension('dani84bs.quickfire'));
	});

	test('Should activate and register command', async () => {
		const extension = vscode.extensions.getExtension('dani84bs.quickfire');
		await extension?.activate();
		const commands = await vscode.commands.getCommands(true);
		assert.ok(commands.includes('quickfire.showQuickActions'));
	});
});
