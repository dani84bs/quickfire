import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let quickActionsDisposable = vscode.commands.registerCommand('quickFire.showQuickActions', () => {
		interface QuickActionItem extends vscode.QuickPickItem {
			actionId?: string;
			args?: any;
			subActions?: QuickActionItem[];
		}

		const mapUserActions = (actions: any[]): QuickActionItem[] => {
			return actions.map(action => ({
				label: action.key,
				description: action.description,
				actionId: action.command,
				args: action.args,
				subActions: action.actions ? mapUserActions(action.actions) : undefined
			}));
		};

		const config = vscode.workspace.getConfiguration('quickFire');
		const userActions = config.get<any[]>('actions', []);
		const allItems: QuickActionItem[] = mapUserActions(userActions);

		const parseArgs = (args: any): any => {
			if (typeof args === 'string') {
				// Check if it's a URI-like string (e.g., file://, http://, vscode://)
				if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(args)) {
					try {
						return vscode.Uri.parse(args);
					} catch {
						return args;
					}
				}
				return args;
			}
			if (Array.isArray(args)) {
				return args.map(parseArgs);
			}
			if (args !== null && typeof args === 'object') {
				const result: any = {};
				for (const key in args) {
					result[key] = parseArgs(args[key]);
				}
				return result;
			}
			return args;
		};

		const showMenu = (items: QuickActionItem[], title?: string, onBack?: () => void) => {
			const BACKSPACE_MARKER = '\u200B';
			const quickPick = vscode.window.createQuickPick<QuickActionItem>();

			// Prepend the marker to all labels so they match the initial value and aren't filtered out
			quickPick.items = items.map(item => ({
				...item,
				label: BACKSPACE_MARKER + item.label
			}));

			quickPick.placeholder = 'Type a letter to execute an action (Backspace to go back)';
			quickPick.title = title;
			quickPick.value = BACKSPACE_MARKER;

			if (onBack) {
				quickPick.buttons = [vscode.QuickInputButtons.Back];
			}

			const executeAction = async (item: QuickActionItem) => {
				if (item.subActions) {
					quickPick.hide();
					showMenu(item.subActions, `${title ? title + ' > ' : ''}${item.description}`, () => {
						showMenu(items, title, onBack);
					});
				} else if (item.actionId) {
					quickPick.hide();
					try {
						const finalArgs = parseArgs(item.args);
						if (finalArgs !== undefined) {
							if (Array.isArray(finalArgs)) {
								await vscode.commands.executeCommand(item.actionId, ...finalArgs);
							} else {
								await vscode.commands.executeCommand(item.actionId, finalArgs);
							}
						} else {
							await vscode.commands.executeCommand(item.actionId);
						}
					} catch (err) {
						const errorMsg = err instanceof Error ? err.message : String(err);
						vscode.window.showErrorMessage(`Failed to execute command '${item.actionId}': ${errorMsg}`);
					}
				}
			};

			quickPick.onDidChangeValue(value => {
				if (onBack && value === '') {
					quickPick.hide();
					onBack();
					return;
				}

				if (value === BACKSPACE_MARKER) {
					return;
				}

				const actualInput = value.startsWith(BACKSPACE_MARKER) ? value.slice(BACKSPACE_MARKER.length) : value;

				if (actualInput === '') {
					return;
				}

				const matchedItem = items.find(item => item.label.toLowerCase() === actualInput.toLowerCase());
				if (matchedItem) {
					executeAction(matchedItem);
				} else {
					quickPick.value = BACKSPACE_MARKER;
				}
			});

			quickPick.onDidAccept(() => {
				const selectedItem = quickPick.selectedItems[0];
				if (selectedItem) {
					const originalItem = items.find(i => i.label === selectedItem.label.replace(BACKSPACE_MARKER, ''));
					if (originalItem) {
						executeAction(originalItem);
					}
				}
			});

			quickPick.onDidTriggerButton(button => {
				if (button === vscode.QuickInputButtons.Back && onBack) {
					quickPick.hide();
					onBack();
				}
			});

			quickPick.onDidHide(() => quickPick.dispose());
			quickPick.show();
		};

		showMenu(allItems);
	});

	context.subscriptions.push(quickActionsDisposable);
}

export function deactivate() { }
