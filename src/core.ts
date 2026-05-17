import * as vscode from 'vscode';

export interface QuickActionItem extends vscode.QuickPickItem {
	actionId?: string;
	args?: any;
	subActions?: QuickActionItem[];
}

/**
 * Recursively maps user action configuration to QuickActionItems.
 */
export const mapUserActions = (actions: any[]): QuickActionItem[] => {
	return actions.map(action => ({
		label: action.key,
		description: action.description,
		actionId: action.command,
		args: action.args,
		subActions: action.actions ? mapUserActions(action.actions) : undefined
	}));
};

/**
 * Parses arguments, converting URI-like strings to vscode.Uri objects.
 */
export const parseArgs = (args: any): any => {
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

/**
 * Finds an action that strictly matches the input (case-sensitive).
 */
export const findMatchingAction = (items: QuickActionItem[], input: string): QuickActionItem | undefined => {
	return items.find(item => item.label === input);
};
