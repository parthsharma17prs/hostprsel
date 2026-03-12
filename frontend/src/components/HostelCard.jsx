import React from 'react';
import { useNavigate } from 'react-router-dom';

const HostelCard = (props) => {
    const navigate = useNavigate();

    const imageUrl = props.images && props.images.length > 0
        ? props.images[0]
        : '/placeholder-hostel.jpg';

    // Format price with currency symbol
    const formattedPrice = `₹${props.price?.toLocaleString('en-IN') || '0'}`;
    const hasDiscount = props.discountedPrice && props.discountedPrice < props.price;
    const formattedDiscountedPrice = hasDiscount ? `₹${props.discountedPrice?.toLocaleString('en-IN')}` : null;

    // Calculate reviews count from rating (placeholder logic)
    const reviewsCount = Math.floor((props.rating || 0) * 10);

    const handleCardClick = () => {
        navigate(`/hostel/${props._id}`);
    };

    return (
        <div
            onClick={handleCardClick}
            data-cursor="view"
            className='group relative bg-[#f0ebd8] p-2 overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl cursor-pointer w-full hover:-translate-y-2'
        >
            <div className='border-2 border-[#0d1b2a]'>

                {/* Image Container */}
                <div className='relative h-44 sm:h-48 md:h-40 xl:h-44 w-full overflow-hidden bg-[#0d1b2a]'>
                    <img
                        src={imageUrl}
                        alt={props.name || 'Hostel'}
                        className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                        onError={(e) => {
                            e.target.src = '/placeholder-hostel.jpg';
                        }}
                    />

                    {/* Coming Soon Badge */}
                    {props.comming_soon && (
                        <div className='absolute top-2 right-2 bg-[#0d1b2a] text-[#f0ebd8] px-2 py-1 text-[10px] sm:text-xs font-semibold shadow-lg'>
                            Coming Soon
                        </div>
                    )}

                    {/* Popular Badge */}
                    {props.popular && !props.comming_soon && (
                        <div className='absolute top-2 right-2 bg-[#f0ebd8] text-[#0d1b2a] px-2 py-1 text-[10px] sm:text-xs font-bold shadow-lg flex items-center gap-1'>
                            <svg className='w-2.5 h-2.5 sm:w-3 sm:h-3' fill='currentColor' viewBox='0 0 20 20'>
                                <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                            </svg>
                            Popular
                        </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className='absolute inset-0 bg-[#0d1b2a]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                </div>

                {/* Content Container */}
                <div className='p-4 sm:p-5 space-y-3 sm:space-y-4'>

                    {/* Name and Location */}
                    <div className='space-y-1'>
                        <h3 className='text-base sm:text-lg font-bold line-clamp-1 text-[#0d1b2a] transition-colors'>
                            {props.name || 'Unnamed Hostel'}
                        </h3>
                        <p className='text-[#0d1b2a] text-xs sm:text-sm flex items-center gap-1.5 opacity-70'>
                            <svg className='w-3.5 h-3.5 shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                                <path fillRule='evenodd' d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z' clipRule='evenodd' />
                            </svg>
                            <span className='line-clamp-1'>{props.location || 'Location not specified'}</span>
                        </p>
                    </div>

                    {/* Gender & Type Tags */}
                    {(props.gender || props.hostelType || props.flatType || props.propertyType) && (
                        <div className='flex flex-wrap gap-2'>
                            {props.gender && (
                                <span className='bg-[#0d1b2a] text-[#f0ebd8] px-2.5 py-1 text-[10px] sm:text-xs font-semibold rounded-sm'>
                                    {props.gender}
                                </span>
                            )}
                            {props.propertyType === 'flat' && props.flatType && (
                                <span className='bg-[#0d1b2a] text-[#f0ebd8] px-2.5 py-1 text-[10px] sm:text-xs font-semibold rounded-sm'>
                                    {props.flatType}
                                </span>
                            )}
                            {props.propertyType !== 'flat' && props.hostelType && (
                                <span className='bg-[#0d1b2a] text-[#f0ebd8] px-2.5 py-1 text-[10px] sm:text-xs font-semibold rounded-sm'>
                                    {props.hostelType}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Rating and Price */}
                    <div className='flex items-center justify-between pt-3 border-t border-[#0d1b2a]/10'>
                        <div className='flex items-center gap-1.5'>
                            <svg className='w-4 h-4 text-[#0d1b2a]' fill='currentColor' viewBox='0 0 20 20'>
                                <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                            </svg>
                            <span className='text-[#0d1b2a] font-bold text-sm sm:text-base'>
                                {props.rating?.toFixed(1) || 'N/A'}
                            </span>
                            <span className='text-[#0d1b2a] opacity-50 text-[10px] sm:text-xs'>
                                ({reviewsCount})
                            </span>
                        </div>

                        <div className='text-right'>
                            {hasDiscount ? (
                                <>
                                    <p className='text-[#0d1b2a]/50 text-xs sm:text-sm line-through'>
                                        {formattedPrice}
                                    </p>
                                    <p className='text-[#0d1b2a] text-lg sm:text-xl font-black'>
                                        {formattedDiscountedPrice}
                                        <span className='text-xs font-normal opacity-50 ml-0.5 tracking-tight'>/mo</span>
                                    </p>
                                </>
                            ) : (
                                <p className='text-[#0d1b2a] text-lg sm:text-xl font-black'>
                                    {formattedPrice}
                                    <span className='text-xs font-normal opacity-50 ml-0.5 tracking-tight'>/mo</span>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Beds Available — hostel only */}
                    {props.propertyType !== 'flat' && props.totalRemainingBeds > 0 && (
                        <div className='flex items-center gap-1.5 text-xs sm:text-sm text-[#0d1b2a]'>
                            <div className={`w-2 h-2 rounded-full ${props.totalRemainingBeds < 5 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                            <span className='opacity-70'>
                                <span className='font-bold opacity-100'>{props.totalRemainingBeds}</span> spots left
                            </span>
                        </div>
                    )}
                </div>

                {/* Hover Effect Overlay */}
                <div className='absolute inset-0 border-2 border-[#0d1b2a] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'></div>
            </div>
        </div>
    );
};

export default HostelCard;