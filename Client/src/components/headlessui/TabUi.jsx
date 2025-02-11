import { Tab, TabGroup, TabList } from "@headlessui/react";

export default function TabUI({ activeTab, setActiveTab, TabCategories }) {
    return (
        <TabGroup
            selectedIndex={TabCategories.findIndex((tab) => tab.key === activeTab)}
            onChange={(index) => setActiveTab(TabCategories[index].key)}
            className={"px-4 pt-4"}
        >
            <TabList className="flex gap-2">
                {TabCategories.map(({ name, key }, index) => (
                    <Tab
                        key={key}
                        className={`rounded-full py-1 px-3 text-sm/6 font-semibold text-blackOpacity70 focus:outline-none ${
                            activeTab === key
                                ? "bg-og-gradient text-white"
                                : "data-[hover]:bg-black/5 data-[focus]:outline-1 data-[focus]:outline-black"
                        }`}
                    >
                        {name}
                    </Tab>
                ))}
            </TabList>
        </TabGroup>
    );
}
