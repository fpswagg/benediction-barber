import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { arr, getStore, obj, requireDash, str } from "@/lib/dash";
import { editPhoto, setBrandImage } from "../actions";
import { ActionForm, ImageField, Submit } from "../_ui/forms";
import { Card, Empty, PageTitle, inputCls } from "../_ui/fields";
import { PhotoUploader } from "../_ui/photo-uploader";
import { PHOTO_CATEGORIES } from "../_ui/photo-categories";

export default async function Photos() {
  const ctx = await requireDash();
  const store = await getStore(ctx);
  const gallery = arr(obj(store.metadata).gallery)
    .map(obj)
    .map((g) => ({ url: str(g.url), caption: str(g.caption), category: str(g.category) || "salon" }))
    .filter((g) => g.url);

  return (
    <div className="space-y-5">
      <PageTitle title="Photos" sub={`${gallery.length} photos dans la galerie du site.`} />

      <Card title="Ajouter à la galerie">
        <PhotoUploader />
        <p className="mt-3 text-xs text-muted-foreground">Les photos sont réduites automatiquement avant l&apos;envoi. Les nouvelles apparaissent en premier.</p>
      </Card>

      <Card title="Galerie">
        {gallery.length ? (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {gallery.map((p, i) => (
              <li key={p.url} className="overflow-hidden rounded-xl border border-border bg-background">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt={p.caption} className="aspect-square w-full object-cover" loading="lazy" />
                <div className="space-y-2 p-2">
                  <ActionForm action={editPhoto} className="space-y-2">
                    <input type="hidden" name="url" value={p.url} />
                    <input type="hidden" name="op" value="edit" />
                    <input name="caption" defaultValue={p.caption} placeholder="Légende" maxLength={120} className={`${inputCls} py-1.5 text-[13px]`} />
                    <div className="flex gap-1.5">
                      <select name="category" defaultValue={p.category} className={`${inputCls} py-1.5 text-[13px]`}>
                        {PHOTO_CATEGORIES.map(([id, label]) => (
                          <option key={id} value={id}>
                            {label}
                          </option>
                        ))}
                      </select>
                      <Submit variant="line" className="px-2.5 py-1 text-[13px]">
                        OK
                      </Submit>
                    </div>
                  </ActionForm>
                  <div className="flex items-center justify-between">
                    <div className="flex">
                      {i > 0 && (
                        <ActionForm action={editPhoto}>
                          <input type="hidden" name="url" value={p.url} />
                          <input type="hidden" name="op" value="up" />
                          <Submit variant="ghost" className="px-2 py-1" >
                            <ArrowUp className="size-4" />
                            <span className="sr-only">Avancer</span>
                          </Submit>
                        </ActionForm>
                      )}
                      {i < gallery.length - 1 && (
                        <ActionForm action={editPhoto}>
                          <input type="hidden" name="url" value={p.url} />
                          <input type="hidden" name="op" value="down" />
                          <Submit variant="ghost" className="px-2 py-1">
                            <ArrowDown className="size-4" />
                            <span className="sr-only">Reculer</span>
                          </Submit>
                        </ActionForm>
                      )}
                    </div>
                    <ActionForm action={editPhoto} confirm="Retirer cette photo de la galerie ?">
                      <input type="hidden" name="url" value={p.url} />
                      <input type="hidden" name="op" value="delete" />
                      <Submit variant="danger" className="px-2 py-1">
                        <Trash2 className="size-4" />
                        <span className="sr-only">Retirer</span>
                      </Submit>
                    </ActionForm>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <Empty>Pas encore de photos.</Empty>
        )}
      </Card>

      <div className="grid gap-5 md:grid-cols-2">
        <Card title="Logo">
          <ActionForm action={setBrandImage} className="space-y-3">
            <input type="hidden" name="which" value="logo" />
            <ImageField current={str(store.logoUrl)} label="Choisir un logo" round max={600} />
            <Submit variant="line">Enregistrer le logo</Submit>
          </ActionForm>
          <p className="mt-3 text-xs text-muted-foreground">Affiché en haut du site. Image carrée de préférence.</p>
        </Card>
        <Card title="Photo d'accueil">
          <ActionForm action={setBrandImage} className="space-y-3">
            <input type="hidden" name="which" value="banner" />
            <ImageField current={str(store.bannerUrl)} label="Choisir une photo" max={1800} />
            <Submit variant="line">Enregistrer la photo</Submit>
          </ActionForm>
          <p className="mt-3 text-xs text-muted-foreground">Grande photo en haut de la page d&apos;accueil.</p>
        </Card>
      </div>
    </div>
  );
}
