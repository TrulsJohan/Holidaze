import glassEffect from '../../assets/classEffect.png';
import greenTop from '../../assets/greenTop.png';
import greenBottom from '../../assets/greenBottom.png';
import yellowTop from '../../assets/yellowTop.png';
import yellowBottom from '../../assets/yellowBottom.png';

export function Background() {
    return (
        <div className="relative w-full max-w-full">
            <img
                src={glassEffect}
                alt="Glass effect background"
                className="absolute inset-0 w-full h-full object-cover z-[-1]"
            />
            <img
                src={greenTop}
                alt="Green top dot decoration"
                className="absolute top-0 right-0 translate-x-[10%] sm:translate-x-[20%] translate-y-[-30%] max-w-[150px] object-contain z-[-1]"
            />
            <img
                src={greenBottom}
                alt="Green bottom dot decoration"
                className="absolute top-[382px] sm:top-[382px] left-0 translate-x-[-10%] sm:translate-x-[-20%] max-w-[150px] object-contain z-[-1]"
            />
            <img
                src={yellowTop}
                alt="Yellow top dot decoration"
                className="absolute top-[84px] left-2 sm:left-9 max-w-[150px] object-contain z-[-1]"
            />
            <img
                src={yellowBottom}
                alt="Yellow bottom dot decoration"
                className="absolute top-[332px] sm:top-[332px] right-0 translate-x-[10%] sm:translate-x-[20%] max-w-[150px] object-contain z-[-1]"
            />
        </div>
    );
}
