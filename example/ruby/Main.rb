def main()
  n = $stdin.gets.to_i
  n.times do
    print "10"
  end
  puts "1"
end

unless defined?(RSpec)
  main()
  exit
end

RSpec.describe do
  ARGV.clear

  it "sample1" do
    judge('4' + "\n", '101010101' + "\n")
  end

  it "sample2" do
    judge('1' + "\n", '101' + "\n")
  end

  it "sample3" do
    judge('10' + "\n", '101010101010101010101' + "\n")
  end

  def judge(input, output)
    $stdin = StringIO.new(input)
    $stdout = StringIO.new

    main()
    actual = $stdout.string

    $stdin = STDIN
    $stdout = STDOUT

    expect(actual).to eq output
  end
end
