export const getTasksClipboardText = (items) => {
    if (!Array.isArray(items)) {
        return '';
    }

    return items.map((task) => {
        let text = `*${task.text?.trim() || ''}*`;
        if (task.day) {
            text += `: ${task.day}`;
        }
        text += task.reminder ? ' [x]' : ' [ ]';
        return text;
    }).join('\n') + (items.length > 0 ? '\n' : '');
};
