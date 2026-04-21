import { LogoAnimation } from "@/components/ui/LogoAnimation";

export default function LogoDemoPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-primary py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-white">Logo Animation Demo</h1>
          <p className="text-white/80 mt-2">Allôservice.ci - Clean 2D Animated Logo</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Animation Timeline */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-secondary mb-6">Animation Timeline</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm font-medium text-primary mb-2">0s - 1s</div>
              <div className="text-gray-600">Line Drawing</div>
              <p className="text-xs text-gray-500 mt-1">Soft fade-in, teal line starts drawing</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm font-medium text-primary mb-2">1s - 2s</div>
              <div className="text-gray-600">Icon Formation</div>
              <p className="text-xs text-gray-500 mt-1">Phone + location pin combine</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm font-medium text-primary mb-2">2s - 3s</div>
              <div className="text-gray-600">Text Animation</div>
              <p className="text-xs text-gray-500 mt-1">Text fades in with upward motion</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm font-medium text-primary mb-2">3s - 4s</div>
              <div className="text-gray-600">Glow Effect</div>
              <p className="text-xs text-gray-500 mt-1">Light sweep + subtle shadow</p>
            </div>
          </div>
        </div>

        {/* Size Variants */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-secondary mb-6">Size Variants</h2>
          <div className="space-y-8">
            <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-500 w-16">Small</span>
              <LogoAnimation size="sm" />
            </div>
            <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-500 w-16">Medium</span>
              <LogoAnimation size="md" />
            </div>
            <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-500 w-16">Large</span>
              <LogoAnimation size="lg" />
            </div>
            <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-500 w-16">XLarge</span>
              <LogoAnimation size="xl" />
            </div>
          </div>
        </div>

        {/* Light Variant */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-secondary mb-6">Light Variant (for dark backgrounds)</h2>
          <div className="bg-[#181c1d] rounded-xl p-8 space-y-6">
            <div className="flex items-center gap-4">
              <LogoAnimation variant="light" size="sm" />
            </div>
            <div className="flex items-center gap-4">
              <LogoAnimation variant="light" size="md" />
            </div>
            <div className="flex items-center gap-4">
              <LogoAnimation variant="light" size="lg" />
            </div>
          </div>
        </div>

        {/* Colors Used */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-secondary mb-6">Color Palette</h2>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#004150]"></div>
              <div>
                <div className="font-medium">Teal (Primary)</div>
                <div className="text-sm text-gray-500">#004150</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#FD7613]"></div>
              <div>
                <div className="font-medium">Orange (Accent)</div>
                <div className="text-sm text-gray-500">#FD7613</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#9C4400]"></div>
              <div>
                <div className="font-medium">Dark Orange</div>
                <div className="text-sm text-gray-500">#9C4400</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#0a4f1a]"></div>
              <div>
                <div className="font-medium">Dark Green</div>
                <div className="text-sm text-gray-500">#0a4f1a</div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specs */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="text-xl font-bold text-secondary mb-4">Technical Specifications</h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              Duration: 3-4 seconds, smooth loop
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              Format: SVG + CSS animations (lightweight)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              Background: Transparent support
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              No heavy effects or JavaScript dependencies
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              Crisp and readable at small sizes
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              Centered composition
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
