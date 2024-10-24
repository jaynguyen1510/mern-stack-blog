import PropTypes from 'prop-types'; // Importing PropTypes
import { memo } from 'react';
import { Link } from 'react-router-dom';

const PostCardComponent = ({ post }) => {
    return (
        <div className="group relative w-full border border-teal-500 hover:border-2 h-[400px] overflow-hidden rounded-lg transition-all sm:w-[430px]">
            <Link to={`/post/${post.slug}`}>
                <img
                    src={post.image}
                    alt="post cover"
                    className="h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20"
                />
            </Link>
            <div className="p-3 flex flex-col gap-2">
                <p className="text-lg font-semibold line-clamp-2">{post.title}</p>
                <span className="italic text-sm">{post.category}</span>
                <Link
                    to={`/post/${post.slug}`}
                    className="z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2"
                >
                    Read article
                </Link>
            </div>
        </div>
    );
};

// Adding PropTypes validation for post object
PostCardComponent.propTypes = {
    post: PropTypes.shape({
        _id: PropTypes.string.isRequired, // Post ID
        userId: PropTypes.string.isRequired, // User ID
        title: PropTypes.string.isRequired, // Post title
        image: PropTypes.string.isRequired, // Required image URL
        content: PropTypes.string.isRequired, // Post content (HTML string)
        category: PropTypes.string.isRequired, // Category of the post
        slug: PropTypes.string.isRequired, // Post slug
        createdAt: PropTypes.string.isRequired, // Date the post was created
        updatedAt: PropTypes.string.isRequired, // Date the post was last updated
    }).isRequired, // 'post' object is required
};

export default memo(PostCardComponent);
