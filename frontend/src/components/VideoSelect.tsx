import { useState } from "react";
import Select from "react-select";
import type { MultiValue } from "react-select";

type Person = {
    id: number;
    name: string;
};

type SelectOption = {
    value: Person;
    label: string;
};

export default function VideoSelect() {
    const people: Person[] = [
        { id: 1, name: "Ana" },
        { id: 2, name: "Ben" },
        { id: 3, name: "Chen" },
        { id: 4, name: "Dina" },
        { id: 5, name: "Eli" },
    ];

    const options: SelectOption[] = people.map((person) => ({
        value: person,
        label: person.name,
    }));

    const [selectedPeople, setSelectedPeople] = useState<SelectOption[]>([]);

    const handleChange = (selected: MultiValue<SelectOption>) => {
        const uniqueSelected = Array.from(
            new Map(selected.map(item => [item.value.id, item])).values()
        );
        setSelectedPeople(uniqueSelected);
    };

    return (
        <div style={{ width: "100%", maxWidth: "400px", margin: "0 auto", marginTop: "20px" }}>
            <label htmlFor="person-select" style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
                Select videos:
            </label>
            <Select
                inputId="person-select"
                options={options}
                value={selectedPeople}
                onChange={handleChange}
                placeholder="Choose people..."
                isMulti
                closeMenuOnSelect={false}
            />
        </div>
    );
}