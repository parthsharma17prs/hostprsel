import {useState, useRef, useEffect} from "react";



export default function Dropdown(props)
{


    const {items}=props;

    const [open, setOpen]=useState(false);
    const [selected, setSelected]=useState(items[0]);
    const ref=useRef(null);

    // close dropdown on outside click
    useEffect(() =>
    {
        const handler=(e) =>
        {
            if (ref.current&&!ref.current.contains(e.target))
            {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={ref} className="relative w-56">
            {/* Button */}
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-4 py-2 rounded-lg border bg-[#0d1b2a] shadow-sm hover:bg-[#1a2a45] text-[#f0ebd8]"
            >
                <span>{selected}</span>

                {/* Arrow */}
                <svg
                    className={`w-4 h-4 transition-transform duration-200 ${open? "rotate-180":""
                        }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {/* Dropdown */}
            {open&&(
                <div className="absolute mt-2 w-full rounded-xl border bg-[#0d1b2a] text-[#f0ebd8] shadow-lg overflow-hidden">
                    {items.map((city) => (
                        <div
                            key={city}
                            onClick={() =>
                            {
                                setSelected(city);
                                setOpen(false);
                            }}
                            className={`flex items-center gap-3 px-4 py-2 cursor-pointer
                ${selected===city
                                    ? "bg-[#1a2a45] font-medium"
                                    :"hover:bg-[#1a2a45]"
                                }`}
                        >
                            {/* Check icon */}
                            <span className="w-4">
                                {selected===city&&"✓"}
                            </span>
                            <span>{city}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
