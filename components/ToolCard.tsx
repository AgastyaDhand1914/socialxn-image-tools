import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tool } from "@/data/tools";
import Link from "next/link";

export const ToolCard = ({ tool }: { tool: Tool }) => {
  const Icon = tool.icon;

  return (
    <Link href={tool.path} className="block">
      <Card
        className="
          p-4 sm:p-6 
          bg-tool-card hover:bg-tool-card-hover 
          transition-all duration-200 
          border-border hover:border-primary 
          cursor-pointer group
          rounded-xl
        "
      >
        <div className="flex items-start gap-3 sm:gap-4">

          {/* Icon */}
          <div
            className="
              p-2.5 sm:p-3 
              rounded-lg 
              bg-primary/10 
              group-hover:bg-primary/20 
              transition-colors
              shrink-0
            "
          >
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary group-hover:text-primary/90 transition-colors" />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1.5 sm:mb-2">

              <h3 className="
                font-semibold 
                text-base sm:text-lg 
                text-foreground 
                group-hover:text-primary 
                transition-colors
                leading-tight
                truncate
              ">
                {tool.name}
              </h3>

              <Badge 
                variant="secondary" 
                className="text-[10px] sm:text-xs shrink-0 py-0.5 px-1.5"
              >
                {tool.category}
              </Badge>

            </div>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {tool.description}
            </p>

          </div>
        </div>
      </Card>
    </Link>
  );
};
