Jekyll::Hooks.register :posts, :post_render do |post|
  next if post.output.nil? || post.output.empty?

  post.output.gsub!(/<img(?=[^>]*\bsrc=)(?![^>]*\bloading=)[^>]*\s\/?>/i) do |tag|
    tag.sub(%r{\s*/?>\s*}, ' loading="lazy" decoding="async">')
  end
end
