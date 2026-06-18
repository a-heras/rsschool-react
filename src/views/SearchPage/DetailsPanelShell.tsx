import type { ReactNode } from 'react';

type DetailsPanelShellProps = {
    detailsId: string | null;
    children: ReactNode;
};

export function DetailsPanelShell({
    detailsId,
    children,
}: DetailsPanelShellProps) {
    if (!detailsId) {
        return (
            <div
                className="details-panel-shell details-panel-shell--empty"
                aria-hidden="true"
            />
        );
    }

    return <div className="details-panel-shell">{children}</div>;
}
