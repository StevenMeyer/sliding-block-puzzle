import { FC, useId } from "react";

interface SeedFormProps {
    action(formData: FormData): Promise<void> | void;
    seedTextName: string;
}

export const SeedForm: FC<SeedFormProps> = ({ action, seedTextName }) => {
    const textboxId = useId();
    return (
        <form action={action}>
            <label htmlFor={textboxId}>Game seed</label>
            <textarea
                id={textboxId}
                name={seedTextName}
            />
            <button
                type="submit"
            >Use this seed</button>
        </form>
    );
};
