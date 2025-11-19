import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function ContactInfoFields() {
  return (
    <div className="space-y-5">
      <div className="text-left">
        <p className="text-sm font-semibold text-slate-800 mb-2">I tuoi dati di contatto</p>
      </div>
      <FormField
        name="nome"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-slate-700 font-medium">Nome</FormLabel>
            <FormControl>
              <Input 
                placeholder="Mario" 
                {...field}
                className="h-12 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="cognome"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-slate-700 font-medium">Cognome</FormLabel>
            <FormControl>
              <Input 
                placeholder="Rossi" 
                {...field}
                className="h-12 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="mail"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-slate-700 font-medium">Email</FormLabel>
            <FormControl>
              <Input 
                type="email" 
                placeholder="mario.rossi@esempio.it" 
                {...field}
                className="h-12 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="telefono"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-slate-700 font-medium">Telefono</FormLabel>
            <FormControl>
              <Input 
                type="tel" 
                placeholder="+39 333 123 4567" 
                {...field}
                className="h-12 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-4">
        <FormField
          name="meseNascita"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 font-medium">Mese di nascita</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="h-12 w-full px-3 border border-slate-200 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                >
                  <option value="">Seleziona...</option>
                  <option value="01">Gennaio</option>
                  <option value="02">Febbraio</option>
                  <option value="03">Marzo</option>
                  <option value="04">Aprile</option>
                  <option value="05">Maggio</option>
                  <option value="06">Giugno</option>
                  <option value="07">Luglio</option>
                  <option value="08">Agosto</option>
                  <option value="09">Settembre</option>
                  <option value="10">Ottobre</option>
                  <option value="11">Novembre</option>
                  <option value="12">Dicembre</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="annoNascita"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 font-medium">Anno di nascita</FormLabel>
              <FormControl>
                <Input 
                  type="text" 
                  placeholder="1985" 
                  maxLength={4}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  {...field}
                  className="h-12 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}


