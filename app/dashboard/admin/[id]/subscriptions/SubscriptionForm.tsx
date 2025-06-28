'use client'
import { useState } from "react";
import { Subscription } from "./types"
import { Minus, Plus } from "lucide-react";
import { add } from "date-fns";


interface Props {
    onSubmit: (sub: Subscription) => void;
    onCancel: () => void;
    initialData?: Subscription;
}

export default function SubscriptionForm({ onSubmit, onCancel, initialData }: Props) {
    const [features, setFeatures] = useState<string[]>(initialData?.subscription_features.map((sf) => sf.features.feature) || ['']);

    console.log("features din baza de date", features)
    const isEditing = !!initialData; // daca exista initialData atunci e true si se editeaza formularul, altfel e false

    const addFeatureField = () => setFeatures([...features, '']);
    const removeFeatureField = (index: number) => 
        setFeatures(features.filter((_, i) => i !== index));

    const updateFeatureField = (index: number, value: string) => {
        const updated = [...features];
        updated[index] = value; 
        setFeatures(updated);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const plan_type = formData.get("plan_type") as string;
        const price = formData.get("price") as string;
        const commission = formData.get("commission") as string;
        const target = formData.get("target") as string;
        const recommendation = formData.get("recommendation") as string;

        const method = isEditing ? 'PATCH' : 'POST';
        const url = isEditing ? `/api/subscriptions/${initialData!.id}`: '/api/subscriptions';

        let bodyData: any = {
            plan_type,
            price: Number(price),
            commission: Number(commission),
            target,
            recommendation,
        }

        if(!isEditing) {
            //doar la creare se adauga features, acestea ulterior nu pot fi modificicate
            bodyData.features = features.map(f => f.trim());
        }

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData),
        });

        if(res.ok) {
            const data = await res.json();
            onSubmit(data);
            console.log("data de la patch", data);
        }
    }

    return(
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-4">
            <div className="mb-4">
                <label htmlFor="plan_type" className="flex flex-col text-gray-700 font-medium mb-2">Subscription Name</label>
                <input
                    type="text"
                    id="plan_type"
                    name="plan_type"
                    defaultValue={initialData?.plan_type || ''}
                    className="block w-full border rounded-md shadow-md px-4 py-2 pr-10 text-sm text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
                />
            </div>
           
            <div className="mb-4">
                <label htmlFor="recommendation" className="flex flex-col text-gray-700 font-medium mb-2">Recommendation</label>
                <input
                    type="text"
                    id="recommendation"
                    name="recommendation"
                    placeholder="Example: Recommended for beginner users"
                    defaultValue={initialData?.recommendation || ''}
                    className="block w-full border rounded-md shadow-md px-4 py-2 pr-10 text-sm text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="target" className="flex flex-col text-gray-700 font-medium mb-2">Plan Purpose</label>
                <input
                    type="text"
                    id="target"
                    name="target"
                    placeholder="e.g. hobby, semi-pro, pro"
                    defaultValue={initialData?.target || ''}
                    className="block w-full border rounded-md shadow-md px-4 py-2 pr-10 text-sm text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
                />
            </div>

            <div className="flex mb-4 gap-4 justify-between">
                <div className="w-full flex flex-col">
                    <label htmlFor="price" className="text-gray-700 font-medium mb-2">Price</label>
                    <input 
                        type="number"
                        id="price"
                        name="price"
                        defaultValue={initialData?.price || ''}
                        placeholder="0"
                        className="block w-full border rounded-md shadow-md px-4 py-2 pr-10 text-sm text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
                    />
                </div>
                <div className="w-full flex flex-col">
                    <label htmlFor="commission" className="text-gray-700 font-medium mb-2">Commission</label>
                    <input 
                        type="number"
                        id="commission"
                        name="commission"
                        defaultValue={initialData?.commission || ''}
                        placeholder="0"
                        className="block w-full border rounded-md shadow-md px-4 py-2 pr-10 text-sm text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
                    />
                </div>
            </div>
            {/*se afiseaza campurile pt features numai in formularul de adaugare, nu si in cel de editare */}
            {!initialData && 
                <div className="mb-4 flex flex-col">
                    <label className="text-gray-700 font-medium mb-2">Features</label>
                    <div className="space-y-2">
                        {features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input 
                                    type="text"
                                    value={feature}
                                    onChange={(e) => updateFeatureField(index, e.target.value)}
                                    className="block w-full border rounded-md shadow-md px-4 py-2 pr-10 text-sm text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeFeatureField(index)}
                                    className="p-2 text-gray-500 hover:text-red-500 rounded-md hover:bg-red-100"
                                >
                                    <Minus size={18} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={addFeatureField}
                        className="mt-2 text-sm flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                        <Plus size={16} />
                        <span>Add feature</span>
                    </button>
                </div>
            }
                
            
            

            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-red-100 rounded-md border"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="px-4 py-2 text-sm bg-gradient-to-r from-blue-400 to-indigo-400 text-white rounded-md transition duration-300 hover:from-blue-500 hover:to-indigo-500 hover:shadow-lg"
                >
                    {isEditing ? 'Save Changes' : 'Add Subscription'}
                </button>
            </div>
        </form>
    );
}