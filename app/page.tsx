import MainPage from '@/components/sections/MainAccountPage';
import { Suspense } from 'react';

export default function Home() {
  return (
    <div>
      <div className="min-h-screen h-auto bg-[#0b0a0aa7] max-md:bg-[#28242476]">
        <div className="flex flex-col items-center bg-[#080808b9] max-md:bg-[#070707a0] min-w-[5] min-h-[5] py-3 px-3">
          <div className="flex justify-center items-center">
            <img
              src="/POE-main-logo-192x192.webp"
              alt="Logo"
              className="w-25 h-25"
            />
          </div>
          <Suspense
            fallback={
              <div className="flex flex-col items-center bg-[#080808b9] max-md:bg-[#070707a0] py-50 px-5">
                Loading...
              </div>
            }
          >
            <MainPage />
          </Suspense>
          <div className="mt-3 text-sm max-w-[390px] break-words">
            <ul className="list-disc pl-4">
              <li>
                Enter your public account name including numeric identifiers
                above. (# is url-encoded to %23)
              </li>
              <li>
                Only public characters are viewable, like in{' '}
                <a
                  href="https://github.com/PathOfBuildingCommunity/PathOfBuilding"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline font-bold"
                >
                  PoB.
                </a>
              </li>

              <li>Uses PoE1 API; PoE2 support coming when available.</li>
              <li>
                <a
                  href="https://www.pathofexile.com/developer/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline font-bold"
                >
                  Docs here
                </a>
              </li>
            </ul>
          </div>
          <div className="mt-[8px] justify-self-center">
            <a
              href="https://github.com/bryan667/next-path-of-strongest"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="githb2.webp" alt="GitHub" width="60px" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
