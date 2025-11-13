import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from "../../context/AuthContext";
import { X, Send } from 'lucide-react';
import api from "../../api/api";

export default function CommentsModal({ isOpen, onClose, product, add }) {
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState([]);
    const { token } = useContext(AuthContext);

    // Sincronizar o estado `comments` com os dados iniciais do produto
    useEffect(() => {
        if (product?.comments && Array.isArray(product.comments)) {
            setComments(product.comments);
        }
    }, [product]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newComment.trim()) return; // Evita envio se o campo estiver vazio.

        try {
            const formData = new URLSearchParams();
            formData.append('produto_slug', product.slug); 
            formData.append('conteudo', newComment);

            await api.post(
                '/comentarios/',
                formData,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token.trim()}`,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            // Sucesso
            const comment = {
                id: comments.length + 1,
                user: {
                    name: product.user?.name,
                    avatar: product.user?.avatar,
                },
                text: newComment,
                date: "agora",
            };

            const updatedProduct = {
                ...product,
                comments: [comment, ...comments],
            };

            setComments(updatedProduct.comments);
            setNewComment('');

            // Atualizar o produto no contexto
            // add(updatedProduct);
        } catch (error) {
            console.error('Erro ao enviar o comentário:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">Comments</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <div key={comment.id} className="flex gap-4">
                                <img
                                    src={`https://skyvendamz.up.railway.app/perfil/${comment.user?.avatar}`}
                                    alt={comment.user?.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{comment.user?.name}</span>
                                        <span className="text-sm text-gray-500">{comment.date}</span>
                                    </div>
                                    <p className="text-gray-700 mt-1">{comment.text}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">Nenhum comentário para exibir</p>
                    )}
                </div>

                <div className="border-t p-4">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Escreva o seu Comentário"
                            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                            onClick={handleSubmit}
                        >
                            <Send className="w-4 h-4" />
                            Enviar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
