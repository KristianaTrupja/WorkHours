export const InputField = ({
    label,
    name,
    value,
    onChange,
    type = "text",
    placeholder
  }: {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    placeholder: string;
  }) => (
    <div className="w-[45%]">
      <label className="block font-semibold text-[#244B77]">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="mt-1 w-full border bg-[#D9D9D9] p-2 rounded-sm"
        placeholder={placeholder}
      />
    </div>
  );