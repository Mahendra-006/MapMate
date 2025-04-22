export default function Avatar({ image, alt }) {
    return (
      <div className="flex-shrink-0">
        <img
          src={image}
          alt={alt}
          className="rounded-full object-cover w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 border-2 border-gray-300"
        />
      </div>
    );
  }
  