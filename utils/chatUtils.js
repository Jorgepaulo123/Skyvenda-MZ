// Update message by ID in chat messages
export function updateMessageById(chats, messageId, updateFn) {
    return chats.map(chat => ({
        ...chat,
        mensagens: chat.mensagens?.map(msg => {
            if (msg.id === messageId || msg.message_id === messageId) {
                return updateFn(msg);
            }
            return msg;
        })
    }));
}

// Get the last message from a chat
export function getLastMessage(chat) {
    if (!chat.mensagens || chat.mensagens.length === 0) return '';
    const lastMsg = chat.mensagens[chat.mensagens.length - 1];
    return lastMsg.content;
}

// Filter friends by search query
export function filterFriends(friends, searchQuery) {
    return friends.filter(friend => 
        friend.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
}

// Create a new chat object from a friend
export function createNewChat(friend) {
    return {
        id: friend.id,
        nome: friend.nome,
        username: friend.username,
        foto: friend.foto_perfil,
        mensagens: []
    };
}

// Update chats list with a new message
export function updateChatsWithMessage(chats, selectedUser, newMessage) {
    const existingChatIndex = chats.findIndex(
        (chat) => chat.id === selectedUser.id
    );

    if (existingChatIndex !== -1) {
        const chat = chats[existingChatIndex];
        const updatedChat = {
            ...chat,
            mensagens: [...(chat.mensagens || []), newMessage],
        };
        return [
            updatedChat,
            ...chats.filter((_, i) => i !== existingChatIndex),
        ];
    } else {
        return [
            {
                ...selectedUser,
                mensagens: [newMessage],
            },
            ...chats,
        ];
    }
}
