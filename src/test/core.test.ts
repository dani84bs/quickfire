import * as assert from 'assert';
import * as vscode from 'vscode';
import { parseArgs, mapUserActions, findMatchingAction, QuickActionItem } from '../core';

suite('Core Logic Unit Tests', () => {

	suite('parseArgs', () => {
		test('should return simple values unchanged', () => {
			assert.strictEqual(parseArgs('hello'), 'hello');
			assert.strictEqual(parseArgs(123), 123);
			assert.strictEqual(parseArgs(true), true);
			assert.strictEqual(parseArgs(null), null);
		});

		test('should parse URI-like strings into vscode.Uri', () => {
			const uriString = 'https://github.com/dani84bs/quickfire';
			const result = parseArgs(uriString);
			assert.ok(result instanceof vscode.Uri);
			assert.strictEqual(result.toString(), uriString);
		});

		test('should parse URIs in nested objects', () => {
			const input = {
				url: 'https://example.com',
				other: 'value'
			};
			const result = parseArgs(input);
			assert.ok(result.url instanceof vscode.Uri);
			assert.strictEqual(result.url.toString(), 'https://example.com/');
			assert.strictEqual(result.other, 'value');
		});

		test('should parse URIs in arrays', () => {
			const input = ['https://example.com', 'simple string'];
			const result = parseArgs(input);
			assert.ok(result[0] instanceof vscode.Uri);
			assert.strictEqual(result[1], 'simple string');
		});
	});

	suite('mapUserActions', () => {
		test('should map flat actions correctly with fullwidth labels', () => {
			const input = [
				{ key: 't', description: 'Terminal', command: 'workbench.action.terminal.toggleTerminal' }
			];
			const result = mapUserActions(input);
			assert.strictEqual(result.length, 1);
			assert.strictEqual(result[0].label, 'ｔ'); // Fullwidth 't'
			assert.strictEqual(result[0].originalKey, 't');
			assert.strictEqual(result[0].description, 'Terminal');
			assert.strictEqual(result[0].actionId, 'workbench.action.terminal.toggleTerminal');
		});

		test('should map nested actions into subActions', () => {
			const input = [
				{
					key: 'f',
					description: 'Files',
					actions: [
						{ key: 'n', description: 'New', command: 'explorer.newFile' }
					]
				}
			];
			const result = mapUserActions(input);
			assert.strictEqual(result[0].label, 'ｆ'); // Fullwidth 'f'
			assert.strictEqual(result[0].originalKey, 'f');
			assert.ok(result[0].subActions);
			assert.strictEqual(result[0].subActions[0].label, 'ｎ'); // Fullwidth 'n'
			assert.strictEqual(result[0].subActions[0].originalKey, 'n');
		});
	});

	suite('findMatchingAction', () => {
		const items: QuickActionItem[] = [
			{ label: 'ｔ', originalKey: 't', description: 'lowercase' },
			{ label: 'Ｔ', originalKey: 'T', description: 'UPPERCASE' }
		];

		test('should match lowercase exactly', () => {
			const match = findMatchingAction(items, 't');
			assert.ok(match);
			assert.strictEqual(match?.description, 'lowercase');
		});

		test('should match uppercase exactly', () => {
			const match = findMatchingAction(items, 'T');
			assert.ok(match);
			assert.strictEqual(match?.description, 'UPPERCASE');
		});

		test('should not match if case differs', () => {
			const match = findMatchingAction([{ label: 'ｔ', originalKey: 't' }], 'T');
			assert.strictEqual(match, undefined);
		});

		test('should return undefined for no match', () => {
			const match = findMatchingAction(items, 'x');
			assert.strictEqual(match, undefined);
		});
	});
});
