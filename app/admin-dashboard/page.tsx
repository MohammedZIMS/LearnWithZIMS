import { ChartBarInteractive } from "@/components/sidebar/chart-bar-interactive";
import { SectionCards } from "@/components/sidebar/section-cards";

import data from "./data.json"
export default function AdminIndexPage() {
  return (
    <>
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartBarInteractive />
      </div>
      
    </>
  )
}