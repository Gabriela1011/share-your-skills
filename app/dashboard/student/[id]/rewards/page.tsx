import Vouchers from "./Vouchers";

export default function Rewards() {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-8 text-center">
                Your Active Vouchers
            </h2>
            <Vouchers />
        </div>
    );
}