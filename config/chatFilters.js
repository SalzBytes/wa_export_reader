export default [
    {
        name: 'urgent',
        applyTo: 'matched', // matched | all
        effects: {
            bubble: {
                background: 'bg-red-200'
            },
            text: {
                color: 'text-red-900',
                weight: 'font-semibold'
            },
            badge: {
                label: 'URGENT',
                class: 'has-background-warning-light'
            }
        }
    },
    {
        name: 'done',
        applyTo: 'matched',
        effects: {
            bubble: {
                background: 'bg-green-200'
            },
            text: {
                decoration: 'line-through'
            }
        }
    },
    {
        name: 'muted_chat',
        applyTo: 'all',
        effects: {
            bubble: {
                background: 'bg-gray-100'
            },
            text: {
                color: 'text-gray-500'
            }
        }
    },
    {
        name: 'deleted_chat',
        applyTo: 'matched', // matched | all
        effects: {
            bubble: {
                background: 'bg-red-200'
            },
            text: {
                color: 'text-red-900',
                weight: 'font-semibold'
            },
            badge: {
                label: 'DELETED',
                class: 'has-background-danger-light has-text-danger-dark'
            }
        }
    },
];
