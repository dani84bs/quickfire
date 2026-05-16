import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Extension should be present', () => {
		assert.ok(vscode.extensions.getExtension('dani.quickFire'));
	});

	test('Should activate and register command', async () => {
		const extension = vscode.extensions.getExtension('dani.quickFire');
		await extension?.activate();
		const commands = await vscode.commands.getCommands(true);
		assert.ok(commands.includes('quickFire.showQuickActions'));
	});
});
