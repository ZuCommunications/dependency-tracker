import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default async function Page() {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    const { data: dependencies, error } = await supabase
        .from('dependency')
        .select('project', { count: 'exact' })

    if (error) {
        return <div className="text-red-500">Error: {error.message}</div>
    }

    // Remove duplicates
    const uniqueProjects = Array.from(new Set(dependencies?.map(dep => dep.project)))

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-background">
            {uniqueProjects.map((project) => (
                <Link href={`/visualizer/${project}`} key={project} className="block">
                    <Card className="hover:bg-accent transition-colors">
                        <CardHeader>
                            <CardTitle className="text-primary">{project}</CardTitle>
                            <CardDescription>Click to view dependencies</CardDescription>
                        </CardHeader>
                    </Card>
                </Link>
            ))}
        </div>
    )
}