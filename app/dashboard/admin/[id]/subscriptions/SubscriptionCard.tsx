import { Subscription } from "./types"
import { Pencil, TrashIcon } from "lucide-react";

interface Props {
    sub: Subscription;
    onEdit: () => void;
    onDelete: () => void;
}

export default function SubscriptionCard({ sub, onEdit, onDelete }: Props) {
    return (
        <div className="bg-white border rounded-lg p-4 hover:shadow-lg transition-shado mb-4">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-semibold">{sub.plan_type}</h3>
                
                    <div className="flex gap-6 mt-1 text-sm text-gray-600">
                        <span>
                            <span className="font-medium text-sm text-gray-700">Price: </span> 
                            {sub.price} RON
                        </span>
                        <span>
                            <span className="font-medium text-sm text-gray-700">Commssion: </span> 
                            {sub.commission} %
                        </span>
                    </div>
                    <div className="text-sm text-gray-600">
                        <span className="font-medium text-sm text-gray-700">Recommendation: </span> 
                        {sub.recommendation}
                    </div>
                    <div className="text-sm text-gray-600">
                        <span className="font-medium text-sm text-gray-700">Usage purpose: </span> 
                        {sub.target}
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={onEdit}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-md"
                    >
                        <Pencil size={16}/>
                    </button>
                   
                    {sub.plan_type !== 'FREE' &&
                        <button
                            onClick={onDelete}
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-md"
                        >
                            <TrashIcon size={16}/>
                        </button>
                    }
                    
                </div>
            </div>

            <div className="mt-4">
                <h3 className="font-medium text-sm text-gray-700 mb-1">Features:</h3>
                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                    {sub.subscription_features?.map((sf, index) => (
                        <li key={index}>{sf.features.feature}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}