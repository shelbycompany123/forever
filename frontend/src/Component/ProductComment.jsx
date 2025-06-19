import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../Context/ShopContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const ProductComments = ({ productId }) => {
    const { token, backendUrl } = useContext(ShopContext);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [showCommentForm, setShowCommentForm] = useState(false);

    // Lấy comments của sản phẩm
    const fetchComments = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/comment/get/${productId}`);
            if (response.data.success) {
                setComments(response.data.comments);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Thêm comment mới
    const handleAddComment = async (e) => {
        e.preventDefault();
        
        if (!token) {
            toast.error("Vui lòng đăng nhập để bình luận");
            return;
        }

        if (!newComment.trim()) {
            toast.error("Vui lòng nhập nội dung bình luận");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${backendUrl}/api/comment/add/${productId}`, {
                comment: newComment.trim()
                // Bỏ productId khỏi body vì đã có trong URL params
            }, {
                headers: { token }
            });

            if (response.data.success) {
                toast.success("Đã thêm bình luận");
                setNewComment('');
                setShowCommentForm(false);
                fetchComments(); // Reload comments
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Có lỗi xảy ra");
        }
        setLoading(false);
    };

    useEffect(() => {
        if (productId) {
            fetchComments();
        }
    }, [productId]);

    return (
        <div className="mt-12 border-t pt-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-gray-900">
                    Đánh giá sản phẩm ({comments.length})
                </h3>
                {token && (
                    <button
                        onClick={() => setShowCommentForm(!showCommentForm)}
                        className="bg-black text-white px-6 py-2 text-sm hover:bg-gray-800 transition-colors rounded-md"
                    >
                        {showCommentForm ? 'Hủy' : 'Viết đánh giá'}
                    </button>
                )}
            </div>

            {/* Form thêm comment */}
            {showCommentForm && (
                <div className="mb-8 bg-gray-50 p-6 rounded-xl border">
                    <h4 className="font-semibold mb-4 text-gray-900">Chia sẻ đánh giá của bạn</h4>
                    <form onSubmit={handleAddComment}>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-4 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            placeholder="Hãy chia sẻ trải nghiệm của bạn về sản phẩm này..."
                            maxLength={500}
                        />
                        <div className="flex justify-between items-center mt-4">
                            <span className="text-sm text-gray-500">
                                {newComment.length}/500 ký tự
                            </span>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCommentForm(false)}
                                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !newComment.trim()}
                                    className="bg-black text-white px-6 py-2 text-sm hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors rounded-md"
                                >
                                    {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* Login prompt */}
            {!token && (
                <div className="mb-8 bg-blue-50 border border-blue-200 p-4 rounded-lg text-center">
                    <p className="text-blue-800">
                        <a href="/login" className="font-semibold underline hover:no-underline">
                            Đăng nhập
                        </a> để viết đánh giá về sản phẩm này
                    </p>
                </div>
            )}

            {/* Danh sách comments */}
            <div className="space-y-6">
                {comments.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <p className="text-gray-500 text-lg font-medium">Chưa có đánh giá nào</p>
                        <p className="text-gray-400 text-sm mt-1">Hãy là người đầu tiên đánh giá sản phẩm này!</p>
                    </div>
                ) : (
                    comments.map((comment, index) => (
                        <div key={comment._id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4">
                                {/* Avatar */}
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-semibold text-lg">
                                        {comment.userName ? comment.userName.charAt(0).toUpperCase() : 'U'}
                                    </span>
                                </div>
                                
                                {/* Content */}
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <h5 className="font-semibold text-gray-900">
                                                {comment.name || 'Người dùng ẩn danh'}
                                            </h5>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-sm text-gray-500">
                                                    {new Date(comment.date).toLocaleDateString('vi-VN', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                                {index === 0 && (
                                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                                        Mới nhất
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <p className="text-gray-700 leading-relaxed">
                                        {comment.comment}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer stats */}
            {comments.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-center text-sm text-gray-500">
                        <span>Tổng cộng {comments.length} đánh giá từ khách hàng</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductComments;