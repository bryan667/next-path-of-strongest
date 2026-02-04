type TProps = {
  isAbsolute?: boolean;
};

export default function Spinner({ isAbsolute = true }: TProps) {
  const positioning = isAbsolute ? 'absolute' : 'relative';

  return (
    <div className="flex justify-center">
      <div
        className={`${positioning} place-self-center w-8 h-8 border-4 border-[#dfcf99] border-t-transparent rounded-full animate-spin`}
      ></div>
    </div>
  );
}
