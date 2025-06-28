import { createClient } from "@/utils/supabase/server";

export async function syncSubscriptionFeatures(subscriptionId: string, features: string[]) {
  const supabase = await createClient();

  // 1. Obține toate features existente
  const { data: allFeatures, error: fetchError } = await supabase
    .from('features')
    .select('*');

  if (fetchError) throw new Error(fetchError.message);

  const featureIds: string[] = [];

  for (const featureText of features) {
    const cleanText = featureText.trim();
    const existing = allFeatures.find(f => f.feature === cleanText);

    if (existing) {
      featureIds.push(existing.id);
    } else {
      const { data: inserted, error: insertError } = await supabase
        .from('features')
        .insert({ name: cleanText })
        .select()
        .single();

      if (insertError) throw new Error(insertError.message);
        featureIds.push(inserted.id);
    }
  }

  // 2. Obține legăturile existente pentru acest abonament
  const { data: currentLinks, error: linkError } = await supabase
    .from('subscription_features')
    .select('feature_id')
    .eq('subscription_id', subscriptionId);

  if (linkError) throw new Error(linkError.message);

  const currentFeatureIds = currentLinks.map(l => l.feature_id);

  // 3. Determină ce trebuie adăugat / șters
  const toAdd = featureIds.filter(id => !currentFeatureIds.includes(id));
  const toRemove = currentFeatureIds.filter(id => !featureIds.includes(id));

  // 4. Adaugă legături noi
  if (toAdd.length > 0) {
    const insertFeature = toAdd.map(fid => ({
      subscription_id: subscriptionId,
      feature_id: fid,
    }));

    const { error: insertError } = await supabase
      .from('subscription_features')
      .insert(insertFeature);

    if (insertError) throw new Error(insertError.message);
  }

  // 5. Șterge legături eliminate
  if (toRemove.length > 0) {
    const { error: deleteError } = await supabase
      .from('subscription_features')
      .delete()
      .match({ subscription_id: subscriptionId })
      .in('feature_id', toRemove);

    if (deleteError) throw new Error(deleteError.message);
  }

  return featureIds;
}