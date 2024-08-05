export default function BoxWindow({scale=1}) {
    const wsize = Math.min(Math.ceil(scale * 100), 100);

    return (
        <div
            className="flex flex-col"
            style={{
                width: `${wsize}%`
            }}
        >
            <div className="bg-black text-white">
                nav
            </div>
            <div className="flex flex-col justify-center items-center h-full">
                content
            </div>
        </div>
    )
}