import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { IoClose } from "react-icons/io5";

export default function PreviewPanel({ show, onClose, values }) {
  const labelClass = "text-xs uppercase font-semibold mb-1";
  const chipClass =
    "bg-muted text-foreground px-2 py-1 rounded-full text-xs font-medium";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white dark:bg-zinc-900 shadow-xl z-[100] border-l border-muted p-6 overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Preview Report</h2>
            <Button type="button" variant="ghost" onClick={onClose}>
              <IoClose size={20} />
            </Button>
          </div>

          <div className="space-y-5 text-sm text-muted-foreground">
            {values.title && (
              <div>
                <p className={labelClass}>Title</p>
                <p className="text-base font-medium text-foreground">
                  {values.title}
                </p>
              </div>
            )}

            {values.description && (
              <div>
                <p className={labelClass}>Description</p>
                <p className="text-sm text-foreground whitespace-pre-line">
                  {values.description}
                </p>
              </div>
            )}

            {values.date && (
              <div>
                <p className={labelClass}>Date</p>
                <p className="text-foreground">{values.date}</p>
              </div>
            )}

            <div>
              <p className={labelClass}>Mood</p>
              <p className="text-foreground">
                {["😭", "😔", "😐", "😊", "🤩"][values.mood]}
              </p>
            </div>

            <div>
              <p className={labelClass}>Intensity</p>
              <p className="text-foreground">{values.intensity} / 100</p>
            </div>

            {values.symbols?.length > 0 && (
              <div>
                <p className={labelClass}>Symbols</p>
                <div className="flex flex-wrap gap-2">
                  {values.symbols.map((s, i) => (
                    <span key={i} className={chipClass}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {values.themes?.length > 0 && (
              <div>
                <p className={labelClass}>Themes</p>
                <div className="flex flex-wrap gap-2">
                  {values.themes.map((theme, i) => (
                    <span key={i} className={chipClass}>
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {values.characters?.length > 0 && (
              <div>
                <p className={labelClass}>Characters</p>
                <div className="flex flex-wrap gap-2">
                  {values.characters.map((c, i) => (
                    <span key={i} className={chipClass}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {values.setting?.length > 0 && (
              <div>
                <p className={labelClass}>Setting</p>
                <div className="flex flex-wrap gap-2">
                  {values.setting.map((s, i) => (
                    <span key={i} className={chipClass}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {values.notes_to_ai && (
              <div>
                <p className={labelClass}>Notes to AI</p>
                <p className="text-foreground whitespace-pre-wrap">
                  {values.notes_to_ai}
                </p>
              </div>
            )}

            {values.real_life_link && (
              <div>
                <p className={labelClass}>Real-Life Link</p>
                <p className="text-foreground whitespace-pre-wrap">
                  {values.real_life_link}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
